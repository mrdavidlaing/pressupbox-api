/*
 * Execute command synchronously from workingDirectory.
 * Will kill command if runs for more than timeoutInMs milliseconds
 * Returns { exitValue: <command exit value>, output: <stdOut + stdErr> }
 * 
 * Requires: lib/commons-exec-1.1.jar (http://commons.apache.org/exec/)
 */
function runCommand(command, workingDirectory, timeoutInMs) {
	
	var executor = new org.apache.commons.exec.DefaultExecutor();
	var cmdLine = org.apache.commons.exec.CommandLine.parse(command);
	
	executor.setWorkingDirectory(new java.io.File(workingDirectory));
	
	var watchdog = new org.apache.commons.exec.ExecuteWatchdog(timeoutInMs);
	executor.setWatchdog(watchdog);
	
	var outputStream = new java.io.ByteArrayOutputStream();
	var streamHandler = new  org.apache.commons.exec.PumpStreamHandler(outputStream);
	executor.setStreamHandler(streamHandler);
    
	var exitValue = executor.execute(cmdLine);
	
	return { "exitValue": exitValue, "output": outputStream.toString() };
}