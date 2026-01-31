import express from "express";
import cors from "cors";

const app = express();

app.get("/", cors(), async (req, res, next) => {
  try {
    if (req.query.username) {
      const username = req.query.username;

      const userRes = await fetch(
        "https://users.roblox.com/v1/usernames/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usernames: [username],
            excludeBannedUsers: false,
          }),
        },
      ).then((r) => r.json());

      const userId = userRes?.data?.[0]?.id;
      if (!userId) return res.status(404).json({ msg: "User not found" });

      const avatarImg = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png`,
      ).then((r) => r.json());

      return res.json({ data: userRes.data[0], avatarImg });
    }

    if (req.query.id) {
      const id = req.query.id;

      const userRes = await fetch(
        `https://users.roblox.com/v1/users/${id}`,
      ).then((r) => r.json());

      const avatarImg = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png`,
      ).then((r) => r.json());

      return res.json({ data: userRes, avatarImg });
    }

    res.status(400).json({ msg: "please provide username or id" });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "Server error" });
});

app.listen(3000, () => console.log("server running"));
