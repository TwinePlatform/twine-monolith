DIR=$(dirname $0)

echo "Summing coverage reports"
$DIR/cc-test-reporter sum-coverage -o coverage/coverage.total.json coverage/*coverage-*.json;

echo "Overall Result: $(cat coverage/coverage.total.json | grep covered_percent | head -n 1)"
echo "Contents:"
echo $(cat coverage/coverage.total.json | head -n 100)

echo "Uploading overall coverage report"
$DIR/cc-test-reporter upload-coverage -i coverage/coverage.total.json;
