import CommonForm from "@/components/common-form";
import { signUpFormControls } from "@/config";
import { callRegisterUserApi } from "@/services";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";

function SignUp() {
  const formData = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // const { toast } = useToast();
  const navigate = useNavigate();


  // the data 'getData' is coming from the form component when the form is submitted 
  // this is b/c of the handleSubmit prop we are passing to the form component
  // so we get the form data here in this function as a result of react-hook-form handling the form submission
  // and passing the form data to this function
  async function handleSubmit(getData) {
  //   const data = await callRegisterUserApi(getData);

  //   console.log(data, "data");

  //   if (data?.success) {
  //     toast.success(
  //       "User register successful",
  //     );
  //     navigate("/tasks/list");
  //   } else {
  //     toast.error(
  //        "Some error occured",
  //     );
  //   }
  

  try {
    const data = await callRegisterUserApi(getData);
       
      toast.success(
        "User register successful",
      );
      navigate("/tasks/list");

  } catch (error) {
          toast.error(
         "Some error occured",
      );
  }
}
  return (
    <div>
      <CommonForm
        form={formData}
        handleSubmit={handleSubmit}
        formControls={signUpFormControls}
        btnText={"Sign Up"}
      />
    </div>
  );
}

export default SignUp;
