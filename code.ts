async function createTimeline(startDate: Date, endDate: Date, startX: number, startY: number) {
  console.log("createTimeline3");

  const nodes: SceneNode[] = [];
  let xPosition = startX;

  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" })

  for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
    const dayOfWeek = day.getDay();

    // Ignore weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const lineHeigt = 1000
    const textWidth = 120;

    const line = figma.createLine();
    line.x = xPosition;
    line.y = startY + lineHeigt;
    line.rotation = 90;
    line.resize(lineHeigt, 0)

    // Make the stroke weight larger at the beginning of each week
    line.strokeWeight = dayOfWeek === 1 ? 2 : 1;
    line.strokes = [{type: 'SOLID', color: {r: 0.5, g: 0.5, b: 0.5}}];

    const weekDayText = figma.createText();
    weekDayText.characters = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()];
    weekDayText.resize(textWidth, 1);
    weekDayText.x = xPosition;
    weekDayText.y = startY + 20;
    weekDayText.fontSize = 16;
    weekDayText.fills = [{type: 'SOLID', color: {r: 0.5, g: 0.5, b: 0.5}}];
    weekDayText.textAlignHorizontal = 'CENTER';
    figma.currentPage.appendChild(weekDayText);

    const dateText = figma.createText();
    dateText.characters = day.toLocaleDateString().slice(0, -5).replace(/(^|\/)0+/g, "$1");
    dateText.resize(textWidth, 1);
    dateText.x = xPosition;
    dateText.y = startY + 44;
    dateText.fontSize = 24;
    dateText.textAlignHorizontal = 'CENTER';
    dateText.fontName = { family: "Inter", style: "Bold" };
    dateText.fills = [{type: 'SOLID', color: {r: 0.5, g: 0.5, b: 0.5}}];
    figma.currentPage.appendChild(dateText);

    nodes.push(line, dateText, weekDayText);

    xPosition += textWidth;
  }

  return nodes;
}


async function main() {

  figma.showUI(__html__);

  figma.ui.onmessage = async msg => {
    if (msg.type === 'create-timeline') {
      const startDate = new Date(msg.startDate);
      const endDate = new Date(msg.endDate);

      const {x, y} = figma.viewport.center;

      const nodes = await createTimeline(startDate, endDate, x, y);

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
      figma.closePlugin();
    }
  };
}

main();
