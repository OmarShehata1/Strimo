

export async function signup(req, res) {
  // Handle signup logic here
  res.send('User signed up');
}


export async function login(req, res) {
  // Handle login logic here
  res.send('User logged in');
}


export function logout(req, res) {
  // Handle logout logic here
  res.send('User logged out');
}

export default {
  signup,
  login,
  logout,
};