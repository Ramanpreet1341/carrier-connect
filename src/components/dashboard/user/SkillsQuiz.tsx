import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, AlertCircle, Clock, Maximize, Minimize, ArrowRight, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: 2,
  },
  {
    id: 2,
    text: "Which planet is known as the 'Red Planet'?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    id: 3,
    text: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
  },
];

const SkillsQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [isTimeRunning, setIsTimeRunning] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const quizContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timeLeft === 0) {
      handleAnswer();
    }

    if (isTimeRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTimeRunning]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleAnswer = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an answer.",
        variant: "destructive",
      });
      return;
    }

    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      toast({
        title: "Correct!",
        description: "You got it right.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was ${quizQuestions[currentQuestion].options[quizQuestions[currentQuestion].correctAnswer]}.`,
        variant: "destructive",
      });
    }

    setSelectedOption(null);
    setTimeLeft(60); // Reset timer
    setIsTimeRunning(true);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setQuizCompleted(true);
      setIsTimeRunning(false);
      exitFullScreen();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(60);
    setIsTimeRunning(true);
  };

  const goToDashboard = () => {
    if (isFullScreen) {
      exitFullScreen();
    }
    navigate("/user-dashboard");
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  };

  const enterFullScreen = () => {
    setIsFullScreen(true);
    if (quizContainerRef.current?.requestFullscreen) {
      quizContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  const exitFullScreen = () => {
    setIsFullScreen(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit full-screen mode: ${err.message}`);
      });
    }
  };

  // Handle full screen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Clean up full screen when component unmounts
  useEffect(() => {
    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error(`Error attempting to exit full-screen mode: ${err.message}`);
        });
      }
    };
  }, []);

  return (
    <div 
      ref={quizContainerRef}
      className={`${isFullScreen ? 'fixed inset-0 w-screen h-screen bg-white p-4 z-50 overflow-auto flex flex-col' : 'container mx-auto mt-8'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-800">Skills Quiz</h1>
        <Button variant="outline" size="sm" onClick={toggleFullScreen}>
          {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
      
      {quizCompleted ? (
        <Card className={`${isFullScreen ? 'w-full max-w-2xl mx-auto my-auto' : 'w-full max-w-md mx-auto'}`}>
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
            <CardDescription>Your results are in.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p>
              You scored {score} out of {quizQuestions.length}
            </p>
            <Progress value={(score / quizQuestions.length) * 100} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetQuiz}>
              Retry Quiz
            </Button>
            <Button onClick={goToDashboard}>Go to Dashboard</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className={`${isFullScreen ? 'w-full max-w-4xl mx-auto my-auto' : 'w-full max-w-lg mx-auto'}`}>
          <CardHeader>
            <CardTitle>Skills Quiz</CardTitle>
            <CardDescription>Answer the following questions to test your knowledge.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-between items-center">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <Badge variant="secondary">
                <Clock className="mr-2 h-4 w-4" />
                {timeLeft} seconds
              </Badge>
            </div>
            <CardDescription>{quizQuestions[currentQuestion].text}</CardDescription>
            <div className="grid gap-2">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`justify-start ${selectedOption === index ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : ""}`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="secondary" onClick={goToDashboard}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Skip Quiz
            </Button>
            <Button onClick={handleAnswer} disabled={selectedOption === null}>
              Submit Answer
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SkillsQuiz;