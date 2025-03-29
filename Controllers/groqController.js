const Groq = require("groq-sdk");
require("dotenv").config();
const groq  = new Groq({apiKey:"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"});
exports.getChatResp = async(req,res,next) =>{
    try{
        const {message} = req.body;//user input from request body is accessed
        if(!message) {
            return res.status(400).json({status:'fail',message:'please enter the query'});
        }
        const chatCompletion = await groq.chat.completions.create({
            messages:[{role:"user",content:message}],
            model:"llama-3.3-70b-versatile"
        });
        const responseText = chatCompletion.choices[0]?.message?.content || "no query generated";
        res.status(200).json({status:'success',response:responseText});
    }
    catch(error) {
        console.log("error encountered",error);
        res.status(500).json({status:'fail',error:'internal server error'});
    }
}

exports.explainQuery = async(req,res,next)=>{
    try{
        const {message} = req.body;
        if(!message) {
            return res.status(400).json({status:'fail',message:"please enter the query"});
        }
        const chatCompletion  = await groq.chat.completions.create({
            messages:[
                {role:"system",content:"you are a query analyser.Given a natural language query,break it down into its structured components.Respond in JSON format with keys:queryType,keyCondtions,fieldsInvolved. ONLY ADD A pseudoSQL field if query has a sql or Sql or SQL word"},
                {role:"user",content:`explain the query:${message}"`}
            ],
            model: "llama-3.3-70b-versatile"
        });
        let respText = chatCompletion.choices[0]?.message?.content || {};
        respText = respText.trim().replace(/^```json|```$/g,"");
        const explaination = JSON.parse(respText);
        res.status(200).json({status:"success",explaination});
    }catch(error) {
        console.log("error in explanation:",error);
        res.status(500).json({status:"fail",message:"internal server error"});
    }
    
}