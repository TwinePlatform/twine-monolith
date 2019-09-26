DIR=$(dirname $0)

echo "Found coverage reports:"
for f in coverage/*; do echo $f; done

echo "Summing coverage reports"
$DIR/cc-test-reporter sum-coverage -o ./coverage.total.json coverage/*;

echo "Overall Result: $(cat ./coverage.total.json | grep covered_percent | head -n 1)"
echo "Contents:"
echo $(cat ./coverage.total.json | head -n 100)

echo "Uploading overall coverage report"
$DIR/cc-test-reporter upload-coverage -i ./coverage.total.json;
