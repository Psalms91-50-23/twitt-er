import homeStyles from '../../styles/Home.module.scss';

const Spinner = ({ message, bgColor, outerCircle, innerCircle }) => {
  return (
    <div className={homeStyles.spinner_container}>
      <svg style={{ background: bgColor, display: "block", width:"110px", height:"110px", viewBox:"0 0 110 110", preserveAspectRatio:"xMidYMid"}}>
      <g transform="translate(50,50)">
      <g transform="scale(0.9)">
      <circle cx="0" cy="0" r="50" fill={outerCircle}></circle>
      <circle cx="0" cy="-28" r="15" fill={innerCircle}>
      <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 0 0;360 0 0"></animateTransform></circle>
      </g>
      </g>
      </svg>
      <p className="spinner-msg">{message}</p>
    </div>
  )
}

export default Spinner