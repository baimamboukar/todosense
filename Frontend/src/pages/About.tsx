

import ReactMarkdown from "react-markdown";

const markdownText = `


Todosense is a cloud-based tasks app built to provide users with easy access to their tasks anytime, anywhere.

----

**Technologies Used**

- **React JS**: Frontend library for building user interfaces.
- **MongoDB**: NoSQL database for storing and retrieving tasks data.
- **Express JS**: Backend framework for building APIs.
- **Node JS**: JavaScript runtime for server-side development.
- **Tailwind CSS**: CSS framework for styling.
- **shadcn-ui**: Component library with Radix UI.
- **TypeScript**: Providing type safety throughout the application.
- **Zod & react-hook-form**: Ensuring type-safe form handling.
- **Vite JS**: Fast, modern bundler for JavaScript and TypeScript.

## Features
- Fetch all tasks data using Express API.
- Store and retrieve tasks data with MongoDB.
- Create, read, update, and delete tasks on the app.
- Utilizes function-based React components.
- Device-responsive and accessibility-optimized UI.
`;


const About = () => {
  return (
    <div className="container py-10">
    
      <div className="prose max-w-4xl mx-auto">
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      </div>
    </div>
  );
};

export default About;
