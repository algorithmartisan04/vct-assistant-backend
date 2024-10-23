import express, { Express } from "express";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

import { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StandardRetryStrategy } from "@aws-sdk/util-retry";

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT_NUM) || 8088;

app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

const retryStrategy = new StandardRetryStrategy(async () => 2); // 2 retries with rate limiting
// Initialize AWS Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  maxAttempts: 3,
  retryStrategy,
});

// POST /api/query: Accept user questions and forward them to Amazon Bedrock
app.post("/api/query", async (req: Request, res: Response) => {
  console.log("API hit with question: ", req.body.message);
  try {
    const { message } = req.body;
    // TODO: Implement Amazon Bedrock integration
    const response = await queryBedrock(message);
    console.log(response);
    res.json({ message: response });
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/players: Retrieve player information
app.get("/api/players", (req: Request, res: Response) => {
  // TODO: Implement player data retrieval
  res.json({ players: [] });
});

// POST /api/build-team: Process user input to build an esports team
app.post("/api/build-team", (req: Request, res: Response) => {
  try {
    const { criteria } = req.body;
    // TODO: Implement team composition logic
    res.json({ team: [] });
  } catch (error) {
    console.error("Error building team:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/agents: Get information about VALORANT agents
app.get("/api/agents", (req: Request, res: Response) => {
  // TODO: Implement agent data retrieval
  res.json({ agents: [] });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Helper function to query Amazon Bedrock (placeholder)
async function queryBedrock(question: string): Promise<string> {
  try {
    const params = {
      modelId: "amazon.titan-text-express-v1", // Replace with your model ID
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: question,
        textGenerationConfig: {
          temperature: 0.7,
          topP: 1,
          maxTokenCount: 300,
          stopSequences: ["User:"],
        },
      }),
    };

    const command = new InvokeModelCommand(params);
    const response = await bedrockClient.send(command);

    // Assuming response.body is a Uint8Array; decode it into a string
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.completion;
  } catch (error) {
    console.error("Error querying Bedrock:", error);
    throw new Error("Failed to query Amazon Bedrock");
  }
}

// async function queryBedrockWithRetries(
//   question: string,
//   retries = 3
// ): Promise<string> {
//   const delay = (ms: number) =>
//     new Promise((resolve) => setTimeout(resolve, ms));
//   for (let i = 0; i <= retries; i++) {
//     try {
//       return await queryBedrock(question);
//     } catch (error: any) {
//       if (error.name === "ThrottlingException" && i < retries) {
//         console.warn(`Throttled, retrying... (${i + 1})`);
//         await delay(1000 * Math.pow(2, i)); // Exponential backoff (1s, 2s, 4s)
//       } else {
//         throw error;
//       }
//     }
//   }
//   throw new Error("Max retries reached");
// }
