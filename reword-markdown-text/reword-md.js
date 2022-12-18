// Imports
import { config } from "https://deno.land/std/dotenv/mod.ts";

// CONFIG
const config_location = Deno.args[1]
const config_data = await config(config_location);
const OPEN_AI_BEARER = configData["OPEN_AI_BEARER"];

// Do it for a paragraph

let generate_prompt = (paragraph) => {
  let result = `Reword the following paragraph, making it more clear and well-written. Preserve the same information and retain markdown syntax.

Original: ${paragraph}

Reworded:`
  return result;
};

let query_open_ai_endpoint = async (line) => {
  let response = await fetch(
    "https://api.openai.com/v1/engines/text-davinci-003/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPEN_AI_BEARER}`
      },
      body: JSON.stringify({
        prompt: generate_prompt(line),
        max_tokens: 200,
      }),
    }
  );
  let response_json = await response.json();
  let completion = response_json?.choices[0]?.text?.slice(1) // slices te first space. Doing this because model doesn't like ending with a space.
  return completion
};

// Do this for a whole text
const filePath = Deno.args[0]

if(!!filePath){
  const fileContents = await Deno.readTextFile(filePath);
  // console.log(fileContents)
  const lines = fileContents.split("\n\n")
  // console.log(lines)
  const modified_lines_promises = lines.slice(1).map(line => query_open_ai_endpoint(line))
  const modified_lines = await Promise.all(modified_lines_promises)
  const modified_text = `${lines[0]}\n\n${modified_lines.join("\n\n")}`
  console.log(modified_text)
}
// Processing
// Write it
/*
const file = await Deno.create("results.json");
let bytes = new TextEncoder().encode(jsonAsText);
await Deno.writeAll(file, bytes);
file.close();
*/
