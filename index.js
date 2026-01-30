import express from "express";
import cors from "cors";
const app = express();
app.get("/", cors({ origin: "*" }), async (req, res, next) => {
  const query = req.query.username;
  const data = await fetch(`https://users.roblox.com/v1/usernames/users`, {
    method: "POST",
    body: JSON.stringify({
      usernames: [query],
      execludeBannedUsers: false,
    }),
  }).then((res) => res.json());
  const avatarImg = await fetch(
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${data?.data?.[0]?.id}&format=Png&size=150x150`
  ).then((res) => res.json());
  try {
    res.status(200).json({ data: data?.data, avatarImg });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.log(err.message, err.stack);
});

app.listen(3000, () => console.log("server runinng"));
