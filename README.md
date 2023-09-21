This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Project Idea
As a learning project, I wanted to write a chat app with context based knowledge.
Therefore I embedded some documents via the OpenAI API and saved the vectors in a weaviate
database. Then, in the chat app, the user can write questions which are answered based on the data
available in the vectorstore. 

A working example can be seen [here](https://next-embeddings.vercel.app/chat/chat). You have to ask me for the password though.

### Future Goal
I am thinking about adding more AI tools like OpenAI functions or text-to-speech. Let's see...

## Getting Started
1. First install all dependencies:
```bash
npm install
```

2. Rename the .env.local.example file to .env.local and add the correct credentials.

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/chat/chat](http://localhost:3000/chat/chat) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
