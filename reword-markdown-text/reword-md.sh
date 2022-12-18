file_path="$1"
reword_dir=/home/loki/Documents/core/software/fresh/js/deno/gpt-utils/reword-text/
deno run --allow-net --allow-env --allow-read="$file_path" $reword_dir/reword-md.js "$file_path" "$OPEN_AI_ENV_LOCATION"
