// scripts/test_endpoints.cjs
const http = require('http');

const endpoints = [
  { method: 'GET', path: '/api/courses/subjects', name: 'Courses Subjects' },
  { method: 'GET', path: '/api/courses/python/worlds', name: 'Python Worlds' },
  { method: 'GET', path: '/api/quizzes/quiz_py_functions', name: 'Get Adaptive Quiz' },
  {
    method: 'POST',
    path: '/api/quizzes/quiz_py_functions/submit',
    name: 'Submit Quiz',
    body: JSON.stringify({
      answers: [{ questionId: 'q1', selectedOption: 1, timeTaken: 12 }],
      difficultyProgression: [{ questionIndex: 0, difficulty: 'Medium' }]
    })
  },
  { method: 'GET', path: '/api/assessments/skills', name: 'Skill Tree Nodes' },
  { method: 'GET', path: '/api/achievements', name: 'Achievements Badges' },
  { method: 'GET', path: '/api/recommendations', name: 'AI Recommendations' },
  { method: 'GET', path: '/api/recommendations/diagnostics', name: 'Recommendations Diagnostics' }
];

async function runTests() {
  console.log('Running endpoint verification against http://localhost:5000...\n');
  let passed = 0;

  for (const ep of endpoints) {
    await new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: ep.path,
        method: ep.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const json = JSON.parse(data);
              const preview = Array.isArray(json)
                ? `Array of ${json.length} items`
                : (json.title || json.overallSummary || json.score !== undefined ? 'Object payload OK' : Object.keys(json).join(', '));
              console.log(`✅ [${res.statusCode}] ${ep.name} (${ep.path}): ${preview}`);
              passed++;
            } catch (e) {
              console.log(`⚠️ [${res.statusCode}] ${ep.name} (${ep.path}): Non-JSON response`);
            }
          } else {
            console.error(`❌ [${res.statusCode}] ${ep.name} (${ep.path}): ${data.slice(0, 100)}`);
          }
          resolve();
        });
      });

      req.on('error', (err) => {
        console.error(`❌ Connection error for ${ep.name}:`, err.message);
        resolve();
      });

      if (ep.body) {
        req.write(ep.body);
      }
      req.end();
    });
  }

  console.log(`\nResults: ${passed}/${endpoints.length} endpoints passed.`);
}

runTests();
