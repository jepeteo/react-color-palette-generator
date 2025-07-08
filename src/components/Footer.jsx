const Footer = () => {
  return (
    <footer className="text-center py-8 mt-12 border-t border-white/10">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-white/60">
        <span>Copyright &copy; 2024. All rights reserved.</span>
        <span className="flex items-center gap-2">
          <span>by</span>
          <a
            href="https://www.linkedin.com/in/thmentis/"
            className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/30 hover:decoration-blue-300"
          >
            Theodoros Mentis
          </a>
        </span>
        <span>Made with React & Modern CSS</span>
      </div>
    </footer>
  );
};

export default Footer;
