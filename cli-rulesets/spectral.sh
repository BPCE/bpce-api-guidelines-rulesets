spec=$1
rules=$2

spectral lint $1 -r $2 -f json -o result.json; cat result.json | jq "map({path: .path | join(\".\"), line: .range.start.line, code: .code, message: .message})";rm result.json