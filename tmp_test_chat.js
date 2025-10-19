(async()=>{
  try{
    const loginRes = await fetch('http://localhost:5000/api/auth/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ email: 'admin@admin.com', password: 'ahsan' })
    });
    const loginData = await loginRes.json();
    console.log('login status', loginRes.status, loginData);
    if(!loginData.token){
      console.error('No token returned; aborting');
      process.exit(1);
    }
    const chatRes = await fetch('http://localhost:5000/api/ai/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json', Authorization: 'Bearer '+loginData.token},
      body:JSON.stringify({ message: 'Hello HealthMate, what is high cholesterol?' })
    });
    const chatText = await chatRes.text();
    console.log('chat status', chatRes.status, chatText);
  }catch(e){
    console.error('test error', e);
  }
})();
