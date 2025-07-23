import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Activity, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiabetesInputs {
  pregnancies: string;
  glucose: string;
  bloodPressure: string;
  skinThickness: string;
  insulin: string;
  bmi: string;
  diabetesPedigree: string;
  age: string;
}

const DiabetesPrediction = () => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState<DiabetesInputs>({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigree: "",
    age: ""
  });
  
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof DiabetesInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setPrediction(null); // Reset prediction when inputs change
  };

  const calculateRisk = (): boolean => {
    // Simple risk calculation based on medical thresholds
    const glucose = parseInt(inputs.glucose);
    const bloodPressure = parseInt(inputs.bloodPressure);
    const bmi = parseFloat(inputs.bmi);
    const age = parseInt(inputs.age);
    const pregnancies = parseInt(inputs.pregnancies);
    const diabetesPedigree = parseFloat(inputs.diabetesPedigree);
    
    let riskScore = 0;
    
    // Glucose risk factors
    if (glucose >= 126) riskScore += 3; // Diabetic range
    else if (glucose >= 100) riskScore += 2; // Pre-diabetic range
    
    // Blood pressure risk
    if (bloodPressure >= 140) riskScore += 2;
    else if (bloodPressure >= 130) riskScore += 1;
    
    // BMI risk
    if (bmi >= 30) riskScore += 2; // Obese
    else if (bmi >= 25) riskScore += 1; // Overweight
    
    // Age risk
    if (age >= 65) riskScore += 2;
    else if (age >= 45) riskScore += 1;
    
    // Pregnancy history (for women)
    if (pregnancies >= 3) riskScore += 1;
    
    // Family history
    if (diabetesPedigree >= 0.5) riskScore += 2;
    else if (diabetesPedigree >= 0.3) riskScore += 1;
    
    return riskScore >= 4;
  };

  const handlePredict = () => {
    // Validate all fields are filled
    const allFieldsFilled = Object.values(inputs).every(value => value !== "");
    
    if (!allFieldsFilled) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all fields to get a prediction.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      const isDiabetic = calculateRisk();
      setPrediction(isDiabetic ? "diabetic" : "not diabetic");
      setIsLoading(false);
      
      toast({
        title: "Prediction Complete",
        description: `Analysis shows: ${isDiabetic ? "High diabetes risk" : "Low diabetes risk"}`,
        variant: isDiabetic ? "destructive" : "default"
      });
    }, 1500);
  };

  const getInputConfig = (field: keyof DiabetesInputs) => {
    switch (field) {
      case 'pregnancies':
        return { type: "number", placeholder: "Enter number of pregnancies (0-17)", min: "0", max: "17" };
      case 'glucose':
        return { type: "number", placeholder: "Enter glucose level (mg/dL)", min: "0", max: "300" };
      case 'bloodPressure':
        return { type: "number", placeholder: "Enter blood pressure (mmHg)", min: "0", max: "200" };
      case 'skinThickness':
        return { type: "number", placeholder: "Enter skin thickness (mm)", min: "0", max: "100" };
      case 'insulin':
        return { type: "number", placeholder: "Enter insulin level (μU/mL)", min: "0", max: "900" };
      case 'bmi':
        return { type: "number", placeholder: "Enter BMI", min: "10", max: "70", step: "0.1" };
      case 'diabetesPedigree':
        return { type: "number", placeholder: "Enter diabetes pedigree function", min: "0", max: "2.5", step: "0.001" };
      case 'age':
        return { type: "number", placeholder: "Enter age in years", min: "1", max: "120" };
      default:
        return { type: "text", placeholder: "" };
    }
  };

  const inputFields = [
    { key: 'pregnancies', label: 'Pregnancies', icon: Heart },
    { key: 'glucose', label: 'Glucose Level', icon: Activity },
    { key: 'bloodPressure', label: 'Blood Pressure', icon: Stethoscope },
    { key: 'skinThickness', label: 'Skin Thickness', icon: Activity },
    { key: 'insulin', label: 'Insulin Level', icon: Activity },
    { key: 'bmi', label: 'BMI', icon: Activity },
    { key: 'diabetesPedigree', label: 'Diabetes Pedigree Function', icon: Heart },
    { key: 'age', label: 'Age', icon: Heart }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-light to-secondary p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-medical-blue bg-clip-text text-transparent">
              Diabetes Risk Assessment
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter your health parameters to assess your diabetes risk using advanced medical algorithms
          </p>
        </div>

        {/* Input Form */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-medical-blue/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Health Parameters
            </CardTitle>
            <CardDescription>
              Please enter your current health measurements in the input fields below
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputFields.map(({ key, label, icon: Icon }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </Label>
                  <Input
                    id={key}
                    value={inputs[key]} 
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    {...getInputConfig(key)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handlePredict} 
                disabled={isLoading}
                className="px-8 py-3 text-lg font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Predict Diabetes Risk
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {prediction && (
          <Card className={`shadow-lg border-2 ${
            prediction === "diabetic" 
              ? "border-destructive bg-destructive/5" 
              : "border-success bg-success/5"
          }`}>
            <CardHeader>
              <CardTitle className={`text-center text-2xl ${
                prediction === "diabetic" ? "text-destructive" : "text-success"
              }`}>
                Risk Assessment Result
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-6">
              <div className={`text-6xl font-bold mb-4 ${
                prediction === "diabetic" ? "text-destructive" : "text-success"
              }`}>
                {prediction === "diabetic" ? "⚠️" : "✅"}
              </div>
              <p className={`text-xl font-semibold mb-2 ${
                prediction === "diabetic" ? "text-destructive" : "text-success"
              }`}>
                {prediction === "diabetic" ? "High Risk Detected" : "Low Risk Assessment"}
              </p>
              <p className="text-muted-foreground mb-4">
                Based on the provided health parameters, you are classified as{" "}
                <span className="font-semibold">{prediction}</span>
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> This is an educational tool and should not replace professional medical advice. 
                  Please consult with a healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiabetesPrediction;