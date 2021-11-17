import * as fs from 'fs';
import * as path_1 from 'path'

export class RootsDB {
    
    
    readonly path: fs.PathLike;
    private record: Map<String, any>;


    constructor(path: fs.PathLike) {
        this.path = path;
        this.record = new Map();
        
        const files = fs.readdirSync(this.path, { withFileTypes: true });
        for (const file of files) {

            if (file.name == "_.json") {
                const contents = JSON.parse(fs.readFileSync(path_1.resolve(this.path.toString(), file.name), "utf8"))
                this.record = new Map([...Object.entries(contents), ...this.record])
                continue;
            }


            if (file.isDirectory()) {
                this.record.set(file.name, undefined);
                continue;
            }

            
            if (!file.isFile()) continue;
            if (![".json"].includes(path_1.extname(file.name))) {
                console.log(file.name);
                continue;
            }
            this.record.set(path_1.parse(file.name).name, JSON.parse(fs.readFileSync(path_1.resolve(this.path.toString(), file.name), "utf8")) || null);
        }

        return new Proxy(this.record, this);
    }


    public get(target: any, prop: string) {
        if (prop in this) return this[prop];
        if (!target.has(prop)) return;
        if (target[prop] != undefined) return target[prop];
        return new RootsDB(path_1.resolve(this.path.toString(), prop));
    }

    public set(target: any, prop: string, valueToSet: any) {
        if (typeof valueToSet != 'object') {
            target.set(prop, valueToSet);
            this.save();
            return true
        }
        const path = path_1.resolve(this.path.toString(), prop);
        if (!fs.existsSync(path)) fs.mkdirSync(path);
        const object = new RootsDB(path);
        for (const [key, value] of Object.entries(valueToSet)) {
            object[key] = value;
        }
        return true;
    }

    public save() {
        let object = {};
        this.record.forEach((value, key) => {
            object[key] = value;
        });

        fs.writeFileSync(path_1.resolve(this.path.toString(), "_.json"),
            JSON.stringify(object)
        )
        return this
    }
}