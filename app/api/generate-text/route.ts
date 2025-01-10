
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} from "@google/generative-ai"




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are an advanced AI writing assistant specializing in seamlessly extending text within a rich-text editor environment like Blocknote (powered by Tiptap). 

    **Key Priorities:**

    * **Maintain Text Integrity:** 
        * Preserve all existing formatting, including bold, italics, headers (H1-H6), lists (ordered & unordered), code blocks, and any other supported styles. 
        * Accurately mirror the underlying structure of the editor, ensuring consistent indentation and hierarchy.
    * **Contextual Awareness:** 
        * Adapt your responses to the specific content type: paragraphs, lists, quotes, headings, etc. 
        * Seamlessly integrate with existing content, avoiding disruptions to the original structure or flow.
    * **Style and Tone:** 
        * Maintain the author's intended writing style and tone, whether it's formal, informal, persuasive, or creative. 
        * Reflect a natural and engaging progression of ideas while adhering to the Tiptap editor's markdown-like syntax.

    **Example:**

    * If presented with a list item, your response should be a new list item with consistent formatting.
    * If presented with a paragraph, your response should continue the paragraph's topic and style.

    **Deliverables:**

    * Provide high-quality, relevant text extensions that enhance the user's writing experience.
    * Ensure the output is compatible with Tiptap's editor and its underlying structure.`,
})

export const runtime = 'edge'

export async function POST(req: Request): Promise<Response> {

    if(!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === ""){
        return new Response(
            'Missing GEMINI_API_KEY -  make sure to add it to your .env file.',
            {
                status: 400
            }
        )
    }

    if(
        process.env.NODE_ENV != 'development' &&
        process.env.KV_REST_API_URL &&
        process.env.KV_REST_API_TOKEN
    ) {
        const ip = req.headers.get('x-forwarded-for');
        const ratelimit  = new Ratelimit({
            redis: kv,
            limiter: Ratelimit.slidingWindow(100000, "1 d")
        })

        const {success , limit, reset, remaining} = await ratelimit.limit(
            `noteblock_ratelimit_${ip}`
        )

        if(!success){
            return new Response("You have reached your request limit for the day",
               {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString(),  
                }
               }
            )
        }
    }


    const { prompt } = await req.json();

    
    const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];


      const generationConfig = {
        maxOutputTokens: 200,
        temperature: 0.7,
        topP: 1
      };
      

    const geminiStream = await model.generateContentStream({
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ],

       generationConfig,
       safetySettings,

    })


    const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const textPart of geminiStream.stream) {
              const text = textPart.text() ?? ""; 
              controller.enqueue(new TextEncoder().encode(text)); 
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });


      return new Response(stream)

}