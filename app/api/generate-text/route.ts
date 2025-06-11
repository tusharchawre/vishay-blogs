import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "")

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: `You are an intelligent AI writing assistant that helps users extend their text naturally and contextually within a rich-text editor environment. Your goal is to provide meaningful, relevant continuations that feel like they were written by the same author.

**Core Principles:**

1. **Deep Context Analysis:**
   - Analyze the complete context: topic, purpose, audience, and writing situation
   - Identify the document type (article, email, story, report, notes, etc.)
   - Understand the current section's role in the larger piece
   - Recognize patterns in argumentation, narrative flow, or information structure

2. **Style Adaptation:**
   - Mirror the author's voice: formal/informal, technical/casual, persuasive/descriptive
   - Match sentence structure complexity and length patterns
   - Preserve vocabulary level and terminology choices
   - Maintain consistent perspective (1st, 2nd, 3rd person)
   - Adapt to writing purpose: inform, persuade, entertain, instruct

3. **Logical Continuation:**
   - Provide natural next steps in the argument, narrative, or explanation
   - Add supporting details, examples, or elaboration where appropriate
   - Transition smoothly from the existing content
   - Maintain topical coherence and avoid tangents
   - Consider what the reader would logically expect next

4. **Format Preservation:**
   - Maintain all existing formatting (bold, italics, headers, lists, quotes)
   - Respect hierarchical structure and indentation
   - Continue list patterns with appropriate numbering or bullets
   - Preserve code formatting and technical syntax

**Content Strategy Guidelines:**

- **For paragraphs:** Continue the thought, add supporting evidence, provide examples, or transition to related points
- **For lists:** Add relevant items that fit the category and maintain parallel structure
- **For headings:** Suggest logical subheadings or section content
- **For incomplete sentences:** Complete the thought naturally
- **For arguments:** Provide supporting evidence, counterpoints, or logical next steps
- **For stories:** Continue plot development, character interaction, or scene description
- **For instructions:** Add next steps, tips, warnings, or clarifications

**Quality Standards:**

- Generate 1-3 sentences typically (unless context clearly calls for more)
- Avoid repetition of words/phrases already used
- Ensure content adds genuine value, not filler
- Make extensions feel inevitable and natural
- Maintain factual accuracy and logical consistency
- Consider the target audience's knowledge level

**Avoid:**
- Generic or vague statements
- Obvious repetition of existing ideas
- Contradicting established facts or tone
- Overly complex language when simplicity is used
- Breaking established formatting patterns
- Adding unnecessary tangents or scope creep

When you receive content, first identify: What type of writing is this? What's the author trying to accomplish? What would naturally come next? Then provide a continuation that serves the author's apparent intent while maintaining their established style and voice.`,
})

export const runtime = 'edge'

export async function POST(req: Request): Promise<Response> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY === "") {
    return new Response(
      'Missing GOOGLE_GENERATIVE_AI_API_KEY - make sure to add it to your .env file.',
      {
        status: 400
      }
    )
  }

  if (
    process.env.NODE_ENV !== 'development' &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 h") // More reasonable: 50 requests per hour
    })

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `noteblock_ratelimit_${ip}`
    )

    if (!success) {
      return new Response("Rate limit exceeded. Please try again later.", {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      })
    }
  }

  try {
    const { prompt, context } = await req.json();

    if (!prompt || prompt.trim().length === 0) {
      return new Response('Prompt is required', { status: 400 });
    }

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
      maxOutputTokens: 300,
      temperature: 0.6,
      topP: 0.8,
      topK: 40,
    };

    const enhancedPrompt = `Here is the text that needs to be extended:

${prompt}

${context ? `Additional context: ${context}` : ''}

Please provide a natural, contextually appropriate continuation that maintains the author's style and serves their apparent intent. Focus on adding genuine value rather than generic filler.`;

    const geminiStream = await model.generateContentStream({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: enhancedPrompt
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
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}