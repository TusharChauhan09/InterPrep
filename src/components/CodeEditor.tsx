import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useMedia } from "use-media";

const CodeEditor = () => {
  const isSmallScreen = useMedia({ maxWidth: 640 });
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"java" | "python" | "javascript">(
    LANGUAGES[0].id
  );
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  };

  const handleLanguageChange = (
    newLanguage: "javascript" | "python" | "java"
  ) => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };

  const monoFont = { fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" };
  const antonFont = { fontFamily: "var(--font-anton, 'Anton', sans-serif)" };

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction={isSmallScreen ? "vertical" : "horizontal"}>
        <ResizablePanel
          defaultSize={45}
          minSize={35}
          maxSize={100}
          className="relative"
        >
          <ScrollArea className="h-full">
            <div className="h-full min-h-0 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2
                      className="text-3xl uppercase leading-tight"
                      style={antonFont}
                    >
                      {selectedQuestion.title}
                    </h2>
                    <p className="mono-label">
                      Choose your language and solve the problem
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={selectedQuestion.id}
                      onValueChange={handleQuestionChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        {CODING_QUESTIONS.map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${language}.png`}
                              alt={language}
                              className="w-5 h-5 object-contain"
                            />
                            {LANGUAGES.find((l) => l.id === language)?.name}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.id} value={lang.id}>
                            <div className="flex items-center gap-2">
                              <img
                                src={`/${lang.id}.png`}
                                alt={lang.name}
                                className="w-5 h-5 object-contain"
                              />
                              {lang.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* PROBLEM DESC */}
                <div className="border border-border">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
                    <BookIcon className="h-4 w-4" />
                    <span className="mono-label">Problem Description</span>
                  </div>
                  <div className="px-5 py-4 text-sm leading-relaxed">
                    <p className="whitespace-pre-line">
                      {selectedQuestion.description}
                    </p>
                  </div>
                </div>

                {/* EXAMPLES */}
                <div className="border border-border">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
                    <LightbulbIcon className="h-4 w-4" />
                    <span className="mono-label">Examples</span>
                  </div>
                  <div className="px-5 py-4">
                    <div className="space-y-4">
                      {selectedQuestion.examples.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <p
                            className="text-xs font-bold uppercase tracking-[0.1em]"
                            style={monoFont}
                          >
                            Example {index + 1}:
                          </p>
                          <pre
                            className="bg-muted p-3 text-sm whitespace-pre-wrap border border-border"
                            style={monoFont}
                          >
                            <div>Input: {example.input}</div>
                            <div>Output: {example.output}</div>
                            {example.explanation && (
                              <div className="pt-2 text-muted-foreground">
                                Explanation: {example.explanation}
                              </div>
                            )}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CONSTRAINTS */}
                {selectedQuestion.constraints && (
                  <div className="border border-border">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
                      <AlertCircleIcon className="h-4 w-4" />
                      <span className="mono-label">Constraints</span>
                    </div>
                    <div className="px-5 py-4">
                      <ul className="space-y-1.5">
                        {selectedQuestion.constraints.map(
                          (constraint, index) => (
                            <li
                              key={index}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-foreground/30 mt-0.5">-</span>
                              <span style={monoFont}>{constraint}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ScrollBar />
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={55} minSize={35} className="border border-border m-1 bg-[#0A0A0A] overflow-hidden">
          {/* Editor header */}
          <div className="h-8 border-b border-[#222] bg-[#0A0A0A] flex items-center px-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <span
              className="ml-auto text-[10px] uppercase tracking-[0.1em] text-[#555]"
              style={monoFont}
            >
              {selectedQuestion.title}.{language === "javascript" ? "js" : language === "python" ? "py" : "java"}
            </span>
          </div>
          <Editor
            height={"calc(100% - 32px)"}
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              wrappingIndent: "indent",
              fontFamily: "'Space Mono', monospace",
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditor;
