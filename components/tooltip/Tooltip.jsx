
const Tooltip = ({tooltip}) => {
  return (
    <div className="tooltip-container">
        <div className="tooltip-triangle"></div>
        <span className="tooltip-msg">{tooltip}</span>
    </div>
  )
}

export default Tooltip