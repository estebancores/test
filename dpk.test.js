const { deterministicPartitionKey } = require("./dpk");
const crypto = require('crypto')

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

describe("deterministicPartitionKey", () => {

  it("Returns the TRIVIAL_PARTITION_KEY when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe(TRIVIAL_PARTITION_KEY);
  });


  it("Returns partition key if is provided", () => {

    const event = {
      partitionKey: "test-key"
    }
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe("test-key");
  });

  // This can be another test case but normally it never go through because of the conditions
  // it("Returns the candidates hash if the length is more than 256", () => {
  //   const event = {
  //     data: {
  //       id: 1,
  //       name: "Esteban"
  //     }
  //   };
  //   const candidate = "a".repeat(MAX_PARTITION_KEY_LENGTH + 1);
  //   const expectedHash = crypto.createHash("sha3-512").update(candidate).digest("hex");
  //   const trivialKey = deterministicPartitionKey(event);
  //   expect(trivialKey).toBe(expectedHash);
  // });

  it("Returns the hash if partitionalKey is not provided on the event", () => {
    const event = {
      data: {
        id: 1,
        name: "Esteban"
      }
    };
    const serializedEvent = JSON.stringify(event)
    const expectedHash = crypto.createHash("sha3-512").update(serializedEvent).digest("hex");
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(expectedHash)
  });

});
