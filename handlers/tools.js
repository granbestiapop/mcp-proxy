export async function handleTools(host, request) {
  process.stderr.write("Handling tool/get request\n" + typeof request);

  const req = await fetch(`${host}/prompts/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method: "prompts/get",
      params: {
        name: request.params.name,
        arguments: {
          appName: request.params.arguments.appName,
        },
      },
    }),
  });

  if (req.status === 500) {
    return {
      content: [
        { type: "text", text: "Error executing prompt (that service exists?)" },
      ],
      isError: true,
    };
  }

  if (!req.ok) {
    const body = await req.json();
    throw new Error(
      `HTTP error! status: ${req.status}, message: ${body.message}`,
    );
  }
  const response = await req.json();

  process.stderr.write(
    "RESPOSE FROM PROMPT:\n" + JSON.stringify(response.messages[0], null, 2),
  );

  return {
    content: [{ type: "text", text: response.messages[0].content.text }],
    isError: false,
  };
}
