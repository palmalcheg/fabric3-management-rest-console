package org.fabric3.management.rest.console;

import org.fabric3.spi.host.ServletHost;
import org.oasisopen.sca.annotation.Destroy;
import org.oasisopen.sca.annotation.EagerInit;
import org.oasisopen.sca.annotation.Init;
import org.oasisopen.sca.annotation.Reference;

@EagerInit
public class ManagementConsoleComponent {
	
	private ServletHost httpServletContainer;

	@Init
	public void init() {
		httpServletContainer.registerMapping(ConsoleResourceServlet.ROOT_PATH, new ConsoleResourceServlet());
	}
	
	public ManagementConsoleComponent (@Reference ServletHost httpServletContainer){
		this.httpServletContainer = httpServletContainer;
	}
	
	@Destroy
	public void destroy () {
		httpServletContainer.unregisterMapping(ConsoleResourceServlet.ROOT_PATH);
	}
	
}
