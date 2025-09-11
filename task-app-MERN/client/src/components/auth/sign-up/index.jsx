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

  async function handleSubmit(getData) {
    const data = await callRegisterUserApi(getData);

    console.log(data, "data");

    if (data?.success) {
      toast.success(
        "User register successful",
      );
      navigate("/tasks/list");
    } else {
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
