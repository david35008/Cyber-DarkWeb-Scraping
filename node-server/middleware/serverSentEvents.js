module.exports = useServerSentEventsMiddleware = (req, res, next) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();
  
    const sendEventStreamData = (data) => {
      const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`;
      console.log(sseFormattedResponse);
      res.write(sseFormattedResponse);
    };
  
    Object.assign(res, {
      sendEventStreamData,
    });
  
    next();
  };
  