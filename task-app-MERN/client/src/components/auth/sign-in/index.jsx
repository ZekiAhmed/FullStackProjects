import CommonForm from "@/components/common-form";
import { signInFormControls } from "@/config";
import { callLoginUserApi } from "@/services";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";

function SignIn() {
  const formData = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  async function handleSubmit(getData) {
    // console.log(getData);

    // const data = await callLoginUserApi(getData);
    // console.log(data, "data");

    // if (data?.success) navigate("/tasks/list");

    try {
      const data = await callLoginUserApi(getData);
      console.log(data, "data");
      navigate("/tasks/list");
      toast.success(data?.message);
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
  }

  return (
    <div>
      <CommonForm
        btnText={"Sign In"}
        handleSubmit={handleSubmit}
        formControls={signInFormControls}
        form={formData}
      />
    </div>
  );
}

export default SignIn;
