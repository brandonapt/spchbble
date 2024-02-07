const ncanvas = require("canvas");
const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  // check to see if the user attached an image
  if (message.attachments.size === 0) {
    message.channel.send("you need to attach an image to speechbubble it!!");
    return;
  }

  // get the image
  const attachment = message.attachments.first();
  const image = await ncanvas.loadImage(attachment.url);

  // create a canvas
  const canvas = ncanvas.createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  // draw the image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // load speechbubble.png
  const speechbubble = await ncanvas.loadImage("./speechbubble.png");

  // draw the speechbubble
  ctx.drawImage(
    speechbubble,
    0,
    0,
    canvas.width,
    (speechbubble.height + image.height) / 7
  );

  // make everything the speechbubble is covering transparent, but only look above where the speechbubble is any shade of brown
  const imageData = ctx.getImageData(0, 0, canvas.width, (speechbubble.height + image.height) / 7);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (
      data[i] > 100 &&
      data[i] < 200 &&
      data[i + 1] > 50 &&
      data[i + 1] < 150 &&
      data[i + 2] < 100
    ) {
      data[i + 3] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // uplaod to discord as a gif
  const buffer = canvas.toBuffer("image/png");
  const attachment2 = new Discord.AttachmentBuilder(buffer).setName(
    "speechbubbled.gif"
  );
  message.channel.send({ files: [attachment2] });
};
