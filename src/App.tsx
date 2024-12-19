import { useState } from 'react'
import './App.css'
import * as tf from '@tensorflow/tfjs';
import { Loading } from './components/Loading';


function App() {
  const [domain, setDomain] = useState('')
  const [error, setError] = useState<string>('')
  const [result, setResult] = useState<{
    class: number;
    probability: number;
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const isValidDomain = (domain: string): boolean => {
    // 更严格的域名验证规则：
    // 1. 必须包含至少一个点号
    // 2. 顶级域名至少2个字符
    // 3. 不能以点号开始或结束
    // 4. 每个部分必须是有效的域名标签
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!domain.includes('.')) {
      return false;
    }

    const parts = domain.split('.');
    const tld = parts[parts.length - 1];

    return domain.length > 0 &&
      domain.length <= 253 &&
      domainRegex.test(domain) &&
      tld.length >= 2 &&  // 顶级域名至少2个字符
      parts.every(part => part.length >= 1 && part.length <= 63);  // 每个部分长度限制
  }

  async function handleCheck() {
    setError('');
    setResult(null);

    if (!isValidDomain(domain)) {
      setError('请输入有效的域名格式');
      return;
    }

    try {
      setLoading(true);
      const modelPath = '/model/model.json';
      const model = await tf.loadGraphModel(modelPath);

      const predictor = predictDGA(model, domain);
      const predictionResult = await predictor.predict();
      setResult(predictionResult);

    } catch (error) {
      console.error('预测出错:', error);
      setError('预测过程中发生错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }

  function predictDGA(model: tf.GraphModel, domain: string) {
    // 定义有效字符和映射
    const validCharacters = "$abcdefghijklmnopqrstuvwxyz0123456789-_.";
    const tokens = Object.fromEntries(
      Array.from(validCharacters).map((char, index) => [char, index])
    );

    // 域名编码函数
    function encodeDomain(domain: string): number[] {
      return Array.from(domain.toLowerCase())
        .map(char => tokens[char] || 0);
    }

    // 填充序列函数
    function padSequence(sequence: number[], maxLen: number): number[] {
      if (sequence.length > maxLen) {
        return sequence.slice(0, maxLen);
      }
      return [
        ...sequence,
        ...Array(maxLen - sequence.length).fill(0)
      ];
    }

    // 编码并填充域名
    const domainEncoded = padSequence(encodeDomain(domain), 45);

    // 准备模型输入张量
    const inputTensor = tf.tensor2d([domainEncoded]);

    // 返回预测结果的 Promise
    return {
      modelId: "cacic-2018-model",
      domain: domain,
      async predict() {
        try {
          const prediction = await model.predict(inputTensor) as tf.Tensor;
          const probability = (await prediction.data())[0];

          // 清理内存
          inputTensor.dispose();
          prediction.dispose();

          return {
            class: probability > 0.9 ? 1 : 0,
            probability: probability
          };
        } catch (error) {
          console.error('预测出错:', error);
          throw error;
        }
      }
    };
  }

  return (
    <div className="home">
      <div className="container">
        <h1 style={{ textAlign: 'center' }}>DGA 域名检测</h1>
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setError('');
              }}
              placeholder="请输入要检测的域名"
              className={error ? 'error' : ''}
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={loading || !domain}
          >
            {loading ? (
              <>
                <Loading size={20} />
                检测中...
              </>
            ) : '开始检测'}
          </button>
          {domain && (
            <button
              className="clear-button"
              onClick={() => {
                setDomain('');
                setError('');
                setResult(null);
              }}
            >
              清空
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result">
            <h2>检测结果:</h2>
            <p>域名: {domain}</p>
            <p>类别: {result.class === 1 ? '恶意域名' : '正常域名'}</p>
            <p>置信度: {(result.probability * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
