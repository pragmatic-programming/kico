import * as mock from "mock-fs";
import { Environment, LoadTextfileProcessor } from "../../../src";


test('process', () => {
    // given
    const folderName = 'folderName';
    const fileName = 'index.md';
    const expectedContent = '# Hello world!';
    mock({
        [folderName]: {
            [fileName]: expectedContent,
        },
    });
    const loadTextfileProcessor = new LoadTextfileProcessor();
    const filePath = folderName + '/' + fileName;
    loadTextfileProcessor.environment.setProperty(Environment.SOURCE_MODEL, filePath);
    // when
    loadTextfileProcessor.process()
    // then
    let actualContent = loadTextfileProcessor.environment.getResult();
    expect(actualContent).toEqual(expectedContent);
    mock.restore();
});
