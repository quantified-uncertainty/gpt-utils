## GPT Utils.

### Requirements

- [Deno](<https://deno.land/manual@v1.29.1/getting_started/installation>)
- A valid OpenAI Bearer key
- Some programming knowledge
- A decent operating system, like Linux or MacOS.

## Installation 

Install [Deno](https://deno.land/manual@v1.29.1/getting_started/installation). It's a javascript runtime I like because it has good process and permissions isolation.

Then install this repository:

```
git clone <url>
```

Input your OpenAI secret bearer into the .env file:

```
cd gpt-utils
mv .env.example .env
vim .env ## exit with :wq
```

Then have a look at `reword-markdown-text/reword-md.sh` and `oracle/deploy-oracle.sh`. Edit them so that they have all the information they need, namely:

- The absolute location of your .env file
- The absolute location of the path that they are in.

## Usage

For rewording a file:

```
cd reword-markdown-text
reword-md.sh your_md_file.md
```

For getting a prediction:

```
cd oracle
deploy-oracle.sh
```

You may also want to read the files in the utility you are using.


