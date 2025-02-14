import express from "express";
import * as tf from "@tensorflow/tfjs-node"; // 使用 tfjs-node 以便在 Node.js 中加载模型

const app = express();
const port = 8888;

let model;

// 在服务器启动时加载模型
async function loadModel() {
  try {
    const modelPath = "public/model/model.json"; // 请替换为实际模型路径
    model = await tf.loadGraphModel(`file://${modelPath}`);
    console.log("Model loaded successfully.");
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

// 假设 predictDGA 函数在同一文件中定义
function predictDGA(model, domain) {
  const validCharacters = "$abcdefghijklmnopqrstuvwxyz0123456789-_.";
  const tokens = Object.fromEntries(
    Array.from(validCharacters).map((char, index) => [char, index])
  );

  function encodeDomain(domain) {
    return Array.from(domain.toLowerCase()).map((char) => tokens[char] || 0);
  }

  function padSequence(sequence, maxLen) {
    if (sequence.length > maxLen) {
      return sequence.slice(0, maxLen);
    }
    return [...sequence, ...Array(maxLen - sequence.length).fill(0)];
  }

  const domainEncoded = padSequence(encodeDomain(domain), 45);
  const inputTensor = tf.tensor2d([domainEncoded]);

  return {
    modelId: "cacic-2018-model",
    domain: domain,
    async predict() {
      try {
        const prediction = await model.predict(inputTensor);
        const probability = (await prediction.data())[0];

        inputTensor.dispose();
        prediction.dispose();

        return {
          class: probability > 0.9 ? 1 : 0,
          probability: probability,
        };
      } catch (error) {
        console.error("预测出错:", error);
        throw error;
      }
    },
  };
}

app.get("/query", async (req, res) => {
  const domain = req.query.domain;
  if (!domain) {
    return res.status(400).send("Domain parameter is required");
  }

  try {
    const predictor = predictDGA(model, domain);
    const result = await predictor.predict();
    res.json(result);
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, async () => {
  await loadModel(); // 在服务器启动时加载模型
  console.log(`Server is running on http://localhost:${port}`);
});
