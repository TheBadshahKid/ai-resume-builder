const email = "test@example.com";
const password = "password123";

async function measureLogin() {
  console.time("Frontend (Simulated): API Call");
  
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    console.timeEnd("Frontend (Simulated): API Call");
    
    console.time("Frontend (Simulated): Parse JSON");
    const data = await res.json();
    console.timeEnd("Frontend (Simulated): Parse JSON");
    
    if(res.ok) {
       console.log("Login successful! Token received.");
    } else {
       console.log("Login failed or test user doesn't exist. Attempting to create one for testing...");
       if (data.error === 'Invalid credentials') {
           // Create it
           await fetch('http://localhost:5000/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: "Test", email, password })
           });
           console.log("Created test user. Running login test again...");
           measureLogin();
       }
    }
  } catch (error) {
    console.error("Network or server error. Is the server running on port 5000?", error);
  }
}

measureLogin();
