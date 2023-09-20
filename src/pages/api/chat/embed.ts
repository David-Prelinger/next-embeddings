import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { UnknownHandling, UnstructuredDirectoryLoader, UnstructuredLoader } from "langchain/document_loaders/fs/unstructured";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { ConversationChain, ConversationalRetrievalQAChain, RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
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


import weaviate from 'weaviate-ts-client';


type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    require('dotenv').config()

        const client = (weaviate).client({
            scheme: "https",
            host: "openai-experiments-c3kzigtu.weaviate.network",
            apiKey: new (weaviate).ApiKey(
                process.env.WEAVIATE_API_KEY!
            ),
        });
    
    client.schema.classDeleter()
    .withClassName('Test')
    .do();


    // Fails when one file is empty    
    const loader = new DirectoryLoader("src/documents", {
        ".md": (path) => {
            return new TextLoader(path)},
      }, false, UnknownHandling.Warn);
    const docs = await loader.load();

    
    


    const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPEN_API_KEY})
    
    const store = await WeaviateStore.fromDocuments(docs, embeddings, {client, indexName: "Test"})
    res.status(200).json("ok");

}