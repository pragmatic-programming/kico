import { Commandline } from "../../../src/processors/io/Commandline";

test('process', () => {
    //given
    const commandline = new Commandline<number>();
    process.argv = ["1", "2", "3"]
    //when
    commandline.process()
    //then
    expect(commandline.environment.getResult()).toEqual(3);
});
