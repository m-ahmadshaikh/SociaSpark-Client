export default function getFormErrors(errors) {
  return Object.keys(errors).map((key) => (
    <li key={key}>{JSON.stringify(errors[key])}</li>
  ));
}
