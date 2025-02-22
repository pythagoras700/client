const Loading = () => (
  <div className="flex items-center justify-center gap-2 text-primary-foreground font-['Quicksand']">
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-orange opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-orange"></span>
    </span>
    <p className="font-medium">Your favourite characters are getting ready..</p>
  </div>
);

export default Loading; 