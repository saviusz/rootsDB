import RootsDB from "../src/main";

it("should create instance", ()=>{
    const db = new RootsDB(__dirname + "test");
    expect(db).toBeInstanceOf(RootsDB);
})
