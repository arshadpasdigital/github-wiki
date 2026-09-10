
import { ChatOpenAI } from "@langchain/openai"


export class LLMProvider {
    private static llmInstance:ChatOpenAI|null = null;
    constructor(){
        
    }

    static async getInstance(llmModel?:string){
        if(this.llmInstance){
            return this.llmInstance;
        }

        this.llmInstance = new ChatOpenAI({
            model: llmModel ?? "gpt-5.5",
            temperature: 0,

        })
        return this.llmInstance;
    }

}