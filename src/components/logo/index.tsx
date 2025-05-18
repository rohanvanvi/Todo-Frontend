const Logo = () => {
  return (
    <div className="flex items-center justify-center sm:justify-start">
      <img
        src="/images/logo.gif"
        alt="Todo App Logo"
        className="h-8 w-8"
        style={{ background: "transparent", mixBlendMode: "multiply" }}
      />
    </div>
  );
};

export default Logo;