file_path="$1"
correct_typos_dir=/home/loki/Documents/core/software/fresh/js/deno/gpt-utils/correct-typos/
deno run --allow-net --allow-env --allow-read $correct_typos_dir/correct-typos.js "$file_path" "$OPEN_AI_ENV_LOCATION"
