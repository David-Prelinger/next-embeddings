import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { UnstructuredDirectoryLoader } from "langchain/document_loaders/fs/unstructured";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { ConversationChain, ConversationalRetrievalQAChain, RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import weaviate from "weaviate-ts-client";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder
} from "langchain/prompts";

import { TextLoader } from "langchain/document_loaders/fs/text";
import { AIMessage, BaseMessageFields, ChainValues, HumanMessage, SystemMessage } from 'langchain/schema';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { ChatCompletion } from 'openai/resources/chat/index.mjs';




type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Check if the request method is not POST
  if (req.method !== 'POST') {
    res.status(405).end(); // Send a 405 Method Not Allowed response
    return; // Exit the function early
  }
  require('dotenv').config()

  const client = (weaviate).client({
    scheme: "https",
    host: "openai-experiments-c3kzigtu.weaviate.network",
    apiKey: new (weaviate).ApiKey(
      process.env.WEAVIATE_API_KEY!
    ),
  });
  const prompt: string = req.body.prompt;

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_API_KEY })
  const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo", openAIApiKey: process.env.OPEN_API_KEY, streaming: true });

  const store = await WeaviateStore.fromExistingIndex(embeddings, { client: client, indexName: "Test" });



  var pastMessages = [
    new SystemMessage("Always provide helpful information. Sometimes you can infer it from previous messages. You always know an answer."),
  ];

  const pagecontents: string[] = [];
  (await store.asRetriever().getRelevantDocuments(prompt,)).forEach(e => pagecontents.push(e.pageContent));

  const question = prompt;
  const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
  });
  req.body.history.push({ "role": "user", "content": prompt + ` \n Consider the following context ${pagecontents[0]}` })
  const response: ChatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: req.body.history,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  res.status(200).json(response.choices[0].message.content);

}