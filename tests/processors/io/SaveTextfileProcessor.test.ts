import * as mock from "mock-fs";
import { Environment } from "../../../src";
import * as fs from "fs";
import { SaveTextfileProcessor } from "../../../src/processors/io/SaveTextfileProcessor";


test("process", () => {
    // given
    const folderName = "folderName";
    const fileName = "index.md";
    mock({
        [folderName]: {
            [fileName]: "",
        },
    });
    const saveTextfileProcessor = new SaveTextfileProcessor();
    const filePath = folderName + "/" + fileName;
    const expectedContent = "# Hello world!";
    saveTextfileProcessor.setFilename(filePath);
    saveTextfileProcessor.environment.setProperty(Environment.SOURCE_MODEL, expectedContent);
    // when
    saveTextfileProcessor.process();
    // then
    let actualContent = fs.readFileSync(filePath, "utf8");
    expect(actualContent).toBe(expectedContent);
    mock.restore();
});
