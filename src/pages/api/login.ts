import { withSessionRoute } from '../../utils/session';

export default withSessionRoute(async (req, res) => {
  const { password } = await req.body;
  try {
    if (password === process.env.PASSWORD) {
      const user = { isLoggedIn: true, id: 1 };
      req.session.user = user;
      await req.session.save();
      res.json(user);
    } else {
      res.status(401).end();
    }
  } catch (error) {
    res.status(500).json("Something went wrong.");
  }
});