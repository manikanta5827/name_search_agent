import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import type { Content, Part } from "@google/genai";
import {
  getTeamMembersFunctionDeclaration,
  getTeamMembers
} from "./gemini-functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const functions: Record<string, Function> = {
  get_team_members: getTeamMembers,
};

const config = {
  systemInstruction: `System Instruction: You are a Tool-First Agent. Prioritize using available tools for every query involving real-time data, calculations, or external verification. Do not ask for permission; if a tool can be used, execute the tool call immediately. Rely on internal knowledge only when no relevant tool exists.`,
  tools: [
    {
      functionDeclarations: [
        getTeamMembersFunctionDeclaration
      ],
    },
  ]
};

export const getGeminiData = async (contents: Content[]) => {
  console.log("making llm call");

  let response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: config,
  });

  return response;
};

export const runConversation = async (userMessage: string) => {
  const contents: Content[] = [
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  while (true) {
    const response = await getGeminiData(contents);

    const candidate = response.candidates?.[0];
    if (!candidate || !candidate.content) break;

    const modelMessage = candidate.content;
    contents.push(modelMessage);

    const functionCalls = modelMessage.parts?.filter(p => p.functionCall) || [];

    if (functionCalls.length === 0) {
      return modelMessage.parts?.map(p => p.text).filter(Boolean).join("") || "";
    }

    const toolResponses: Part[] = await Promise.all(
      functionCalls.map(async (part) => {
        const call = part.functionCall!;
        const fn = functions[call.name!];
        console.log(`Calling tool: ${call.name} with args:`, call.args);

        const result = fn ? await fn(call.args) : { error: `Function ${call.name} not found` };

        return {
          functionResponse: {
            id: call.id,
            name: call.name,
            response: { result },
          },
        };
      })
    );

    contents.push({
      role: "user",
      parts: toolResponses,
    });
  }
};

(async () => {
  const result = await runConversation("Who's name starts with 'pr' in the team members?");
  console.log("Final Result:", result);
})();
