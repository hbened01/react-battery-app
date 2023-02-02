import Swal from "sweetalert2";

const AlertMsg = (data) => {
  data && !(Object.keys(data).length === 0 && data.constructor === Object) && Swal.fire(data);
};

export default AlertMsg;
