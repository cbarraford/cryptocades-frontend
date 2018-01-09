import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'

@inject('store')
@inject('client')
@observer
class DefaultLayout extends Component {

  render() {
    const { me } = this.props.store;
    const tickets = me.mined_hases + me.bonus_hashes;

    return (
	<div className="navbar navbar-inverse">
		<div className="navbar-header">
			<Link className="navbar-brand" to="/"><img src="/assets/images/logo_light.png" alt="" /></Link>

			<ul className="nav navbar-nav pull-right visible-xs-block">
				<li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
			</ul>
		</div>

		<div className="navbar-collapse collapse" id="navbar-mobile">
			<ul className="nav navbar-nav">
				<li className="dropdown">
					<a href="#" className="dropdown-toggle" data-toggle="dropdown">
						<i className="icon-git-compare"></i>
						<span className="visible-xs-inline-block position-right">Git updates</span>
						<span className="badge bg-warning-400">9</span>
					</a>

					<div className="dropdown-menu dropdown-content">
						<div className="dropdown-content-heading">
							Git updates
							<ul className="icons-list">
								<li><a href="#"><i className="icon-sync"></i></a></li>
							</ul>
						</div>

						<ul className="media-list dropdown-content-body width-350">
							<li className="media">
								<div className="media-left">
									<a href="#" className="btn border-primary text-primary btn-flat btn-rounded btn-icon btn-sm"><i className="icon-git-pull-request"></i></a>
								</div>

								<div className="media-body">
									Drop the IE <a href="#">specific hacks</a> for temporal inputs
									<div className="media-annotation">4 minutes ago</div>
								</div>
							</li>

							<li className="media">
								<div className="media-left">
									<a href="#" className="btn border-warning text-warning btn-flat btn-rounded btn-icon btn-sm"><i className="icon-git-commit"></i></a>
								</div>

								<div className="media-body">
									Add full font overrides for popovers and tooltips
									<div className="media-annotation">36 minutes ago</div>
								</div>
							</li>

							<li className="media">
								<div className="media-left">
									<a href="#" className="btn border-info text-info btn-flat btn-rounded btn-icon btn-sm"><i className="icon-git-branch"></i></a>
								</div>

								<div className="media-body">
									<a href="#">Chris Arney</a> created a new <span className="text-semibold">Design</span> branch
									<div className="media-annotation">2 hours ago</div>
								</div>
							</li>

							<li className="media">
								<div className="media-left">
									<a href="#" className="btn border-success text-success btn-flat btn-rounded btn-icon btn-sm"><i className="icon-git-merge"></i></a>
								</div>

								<div className="media-body">
									<a href="#">Eugene Kopyov</a> merged <span className="text-semibold">Master</span> and <span className="text-semibold">Dev</span> branches
									<div className="media-annotation">Dec 18, 18:36</div>
								</div>
							</li>

							<li className="media">
								<div className="media-left">
									<a href="#" className="btn border-primary text-primary btn-flat btn-rounded btn-icon btn-sm"><i className="icon-git-pull-request"></i></a>
								</div>

								<div className="media-body">
									Have Carousel ignore keyboard events
									<div className="media-annotation">Dec 12, 05:46</div>
								</div>
							</li>
						</ul>

						<div className="dropdown-content-footer">
							<a href="#" data-popup="tooltip" title="All activity"><i className="icon-menu display-block"></i></a>
						</div>
					</div>
				</li>

				<li className="dropdown">
					<a href="#" className="dropdown-toggle" data-toggle="dropdown">
						<i className="icon-people"></i>
						<span className="visible-xs-inline-block position-right">Users</span>
					</a>

					<div className="dropdown-menu dropdown-content">
						<div className="dropdown-content-heading">
							Users online
							<ul className="icons-list">
								<li><a href="#"><i className="icon-gear"></i></a></li>
							</ul>
						</div>

						<ul className="media-list dropdown-content-body width-300">
							<li className="media">
								<div className="media-left"><img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
								<div className="media-body">
									<a href="#" className="media-heading text-semibold">Jordana Ansley</a>
									<span className="display-block text-muted text-size-small">Lead web developer</span>
								</div>
								<div className="media-right media-middle"><span className="status-mark border-success"></span></div>
							</li>

							<li className="media">
								<div className="media-left"><img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
								<div className="media-body">
									<a href="#" className="media-heading text-semibold">Will Brason</a>
									<span className="display-block text-muted text-size-small">Marketing manager</span>
								</div>
								<div className="media-right media-middle"><span className="status-mark border-danger"></span></div>
							</li>

							<li className="media">
								<div className="media-left"><img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
								<div className="media-body">
									<a href="#" className="media-heading text-semibold">Hanna Walden</a>
									<span className="display-block text-muted text-size-small">Project manager</span>
								</div>
								<div className="media-right media-middle"><span className="status-mark border-success"></span></div>
							</li>

							<li className="media">
								<div className="media-left"><img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
								<div className="media-body">
									<a href="#" className="media-heading text-semibold">Dori Laperriere</a>
									<span className="display-block text-muted text-size-small">Business developer</span>
								</div>
								<div className="media-right media-middle"><span className="status-mark border-warning-300"></span></div>
							</li>

							<li className="media">
								<div className="media-left"><img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
								<div className="media-body">
									<a href="#" className="media-heading text-semibold">Vanessa Aurelius</a>
									<span className="display-block text-muted text-size-small">UX expert</span>
								</div>
								<div className="media-right media-middle"><span className="status-mark border-grey-400"></span></div>
							</li>
						</ul>

						<div className="dropdown-content-footer">
							<a href="#" data-popup="tooltip" title="All users"><i className="icon-menu display-block"></i></a>
						</div>
					</div>
				</li>
			</ul>

			<p className="navbar-text"><span className="label bg-success-400">Online</span></p>

			<ul className="nav navbar-nav navbar-right">

				<li className="dropdown">
					<a href="#" className="dropdown-toggle" data-toggle="dropdown">
						<i className="fa fa-ticket"></i>
						<span className="visible-xs-inline-block position-right">Messages</span>
						<span className="badge bg-warning-400">{tickets || 0}</span>
					</a>

					<div className="dropdown-menu dropdown-content width-350">
						<div className="dropdown-content-heading">
							Messages
							<ul className="icons-list">
								<li><a href="#"><i className="icon-compose"></i></a></li>
							</ul>
						</div>

						<ul className="media-list dropdown-content-body">
							<li className="media">
								<div className="media-left">
									<img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" />
									<span className="badge bg-danger-400 media-badge">5</span>
								</div>

								<div className="media-body">
									<a href="#" className="media-heading">
										<span className="text-semibold">James Alexander</span>
										<span className="media-annotation pull-right">04:58</span>
									</a>

									<span className="text-muted">who knows, maybe that would be the best thing for me...</span>
								</div>
							</li>

							<li className="media">
								<div className="media-left">
									<img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" />
									<span className="badge bg-danger-400 media-badge">4</span>
								</div>

								<div className="media-body">
									<a href="#" className="media-heading">
										<span className="text-semibold">Margo Baker</span>
										<span className="media-annotation pull-right">12:16</span>
									</a>

									<span className="text-muted">That was something he was unable to do because...</span>
								</div>
							</li>

							<li className="media">
								<div className="media-left"><img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
								<div className="media-body">
									<a href="#" className="media-heading">
										<span className="text-semibold">Jeremy Victorino</span>
										<span className="media-annotation pull-right">22:48</span>
									</a>

									<span className="text-muted">But that would be extremely strained and suspicious...</span>
								</div>
							</li>

							<li className="media">
								<div className="media-left"><img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
								<div className="media-body">
									<a href="#" className="media-heading">
										<span className="text-semibold">Beatrix Diaz</span>
										<span className="media-annotation pull-right">Tue</span>
									</a>

									<span className="text-muted">What a strenuous career it is that I've chosen...</span>
								</div>
							</li>

							<li className="media">
								<div className="media-left"><img src="/assets/images/placeholder.jpg" className="img-circle img-sm" alt="" /></div>
								<div className="media-body">
									<a href="#" className="media-heading">
										<span className="text-semibold">Richard Vango</span>
										<span className="media-annotation pull-right">Mon</span>
									</a>

									<span className="text-muted">Other travelling salesmen live a life of luxury...</span>
								</div>
							</li>
						</ul>

						<div className="dropdown-content-footer">
							<a href="#" data-popup="tooltip" title="All messages"><i className="icon-menu display-block"></i></a>
						</div>
					</div>
				</li>

				<li className="dropdown dropdown-user">
					<a className="dropdown-toggle" data-toggle="dropdown">
						<img src="/assets/images/placeholder.jpg" alt="" />
						<span>{me.username}</span>
						<i className="caret"></i>
					</a>

					<ul className="dropdown-menu dropdown-menu-right">
						<li><a href="#"><i className="icon-user-plus"></i> My profile</a></li>
						<li><a href="#"><i className="icon-coins"></i> My balance</a></li>
						<li><a href="#"><span className="badge badge-warning pull-right">58</span> <i className="icon-comment-discussion"></i> Messages</a></li>
						<li className="divider"></li>
						<li><a href="#"><i className="icon-cog5"></i> Account settings</a></li>
						<li><Link to="/logout"><i className="icon-switch2"></i> Logout</Link></li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
  );
  }
}

export default DefaultLayout;
