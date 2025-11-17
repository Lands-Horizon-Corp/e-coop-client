import React, { useEffect, useState } from "react";
import Handlebars from "handlebars";

export default function HbsRenderer({ templatePath, data }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch(templatePath)
      .then(res => res.text())
      .then(raw => {
        const compiled = Handlebars.compile(raw);
        const result = compiled(data);
        setHtml(result);
      });
  }, [templatePath, data]);

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
