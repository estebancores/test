const crypto = require("crypto");


/*

Considering TRIVIAL_PARTITION_KEY, MAX_PARTITION_KEY_LENGTH variables are static, we don't need to declear them everytime the funciton its called;
Considering everthing its based on the event param, we can return the function if its not defined so we can remove innecesary conditionals;
Created a dataToHash function since is used multiple times in the same function and can be used in future for other one;
Now we have the event, we can make a candidate declaration and we don't need to evaluate if candidate is declare to return the TRIVIAL_PARTITION_KEY;
*/


const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const hashData = (chunk) => {
  if (!chunk) return null;
  return crypto.createHash("sha3-512").update(chunk).digest("hex");
}

exports.deterministicPartitionKey = (event) => {
  let candidate;

  if (!event) return TRIVIAL_PARTITION_KEY;

  candidate = event.partitionKey
    ? event.partitionKey
    : hashData(JSON.stringify(event))

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = hashData(candidate);
  }
  return candidate;
};

/*
exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey;
    } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }

  if (candidate) {
    if (typeof candidate !== "string") {
      candidate = JSON.stringify(candidate);
    }
  } else {
    candidate = TRIVIAL_PARTITION_KEY;
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate;
};
*/